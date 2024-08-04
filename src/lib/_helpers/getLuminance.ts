export function getLuminance(hex: string) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
  
    let a = [r, g, b].map(v => {
      if (v <= 0.03928) {
        return v / 12.92;
      }
      return Math.pow((v + 0.055) / 1.055, 2.4);
    });
  
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}