// Biblioteca central de ícones da plataforma. Antes eram SVGs recriados à
// mão (e reconstruídos várias vezes até ficarem legíveis); agora cada função
// aqui só empresta um nome oficial de ícone do Material Symbols do Google
// (a fonte fica em src/app/layout.tsx, a renderização em src/components/Icon.tsx)
// — o desenho em si é sempre o original do Google, nunca uma aproximação.
// Qualquer ícone novo na plataforma deve nascer aqui, escolhendo um nome daqui:
// https://fonts.google.com/icons

import Icon from "./Icon";

type IconProps = {
  size?: number;
  className?: string;
};

export function IconGear(props: IconProps) {
  return <Icon name="settings" {...props} />;
}

export function IconBurger(props: IconProps) {
  return <Icon name="menu" {...props} />;
}

export function IconClose(props: IconProps) {
  return <Icon name="close" {...props} />;
}

export function IconPerson(props: IconProps) {
  return <Icon name="account_circle" {...props} />;
}

export function IconSearch(props: IconProps) {
  return <Icon name="search" {...props} />;
}

export function IconChevronLeft(props: IconProps) {
  return <Icon name="chevron_left" {...props} />;
}

export function IconChevronRight(props: IconProps) {
  return <Icon name="chevron_right" {...props} />;
}

export function IconPlus(props: IconProps) {
  return <Icon name="add" {...props} />;
}

export function IconLightbulb(props: IconProps) {
  return <Icon name="lightbulb" {...props} />;
}

export function IconTrophy(props: IconProps) {
  return <Icon name="emoji_events" {...props} />;
}

export function IconSwap(props: IconProps) {
  return <Icon name="swap_horiz" {...props} />;
}

export function IconStar(props: IconProps) {
  return <Icon name="star" {...props} />;
}

export function IconCheck(props: IconProps) {
  return <Icon name="check" {...props} />;
}

export function IconLightning(props: IconProps) {
  return <Icon name="bolt" {...props} />;
}

export function IconMapPin(props: IconProps) {
  return <Icon name="location_on" {...props} />;
}

export function IconPencil(props: IconProps) {
  return <Icon name="edit" {...props} />;
}

export function IconTrash(props: IconProps) {
  return <Icon name="delete" {...props} />;
}

// "favorite" cobre os dois estados: preenchido (favoritado) ou só contorno,
// controlado pelo eixo FILL da própria fonte — não são dois ícones
// diferentes, como seria com um set de SVGs tradicional.
export function IconHeart({ filled, ...props }: IconProps & { filled?: boolean }) {
  return <Icon name="favorite" filled={filled} {...props} />;
}
