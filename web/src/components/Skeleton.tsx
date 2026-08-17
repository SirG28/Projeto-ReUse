type Props = {
  className?: string;
};

export default function Skeleton({ className = "" }: Props) {
  return <div className={`animate-pulse rounded-md bg-[#E9E6DF] ${className}`} />;
}
