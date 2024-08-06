
interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

export function LeftPartialEclipse({ width, height } : IconProps) {
  return (
  <svg width={width ?? 16} height={height ?? 16} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0ZM5.85693 0.707778C2.99921 0.783595 0.705882 3.12398 0.705882 6C0.705882 8.87602 2.99921 11.2164 5.85693 11.2922C8.00193 10.4916 9.52941 8.42416 9.52941 6C9.52941 3.57584 8.00193 1.50844 5.85693 0.707778Z" fill="#226362"/>
  </svg>
  );
}

export function RightPartialEclipse({ width, height } : IconProps) {
  return (
  <svg width={width ?? 16} height={height ?? 16} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM6.14307 0.707778C9.00079 0.783595 11.2941 3.12398 11.2941 6C11.2941 8.87602 9.00079 11.2164 6.14307 11.2922C3.99807 10.4916 2.47059 8.42416 2.47059 6C2.47059 3.57584 3.99807 1.50844 6.14307 0.707778Z" fill="#53AEA8"/>
  </svg>
  );
}


