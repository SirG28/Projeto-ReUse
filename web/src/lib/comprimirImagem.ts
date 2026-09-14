// Fotos de câmera de celular costumam vir com vários MB — a Vercel limita o
// corpo de uma Server Action a 4.5MB, então redimensionamos e comprimimos no
// navegador antes de enviar (evita erro ao publicar/editar um item).
export function comprimirImagem(
  file: File,
  maxDimensao = 1200,
  qualidade = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDimensao) {
          height = Math.round((height * maxDimensao) / width);
          width = maxDimensao;
        } else if (height > maxDimensao) {
          width = Math.round((width * maxDimensao) / height);
          height = maxDimensao;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas indisponível"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", qualidade));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
