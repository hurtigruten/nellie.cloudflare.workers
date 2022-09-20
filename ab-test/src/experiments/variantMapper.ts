export const variantMapper = (url: string, variant: string | number) => {
  const url_ = new URL(url);
  url_.searchParams.set("variant", variant.toString().padStart(3, "0"));
  return url_.toString();
};
