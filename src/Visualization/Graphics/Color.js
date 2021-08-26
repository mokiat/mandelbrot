export const rgb = (red, green, blue) => {
  return (
    (0xff << 24) |
    (((blue * 255) & 0xff) << 16) |
    (((green * 255) & 0xff) << 8) |
    ((red * 255) & 0xff)
  );
};
