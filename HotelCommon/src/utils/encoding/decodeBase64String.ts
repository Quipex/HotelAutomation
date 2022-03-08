const decodeBase64String = (base64Text: string) => {
  const buff = Buffer.from(base64Text, 'base64');
  return buff.toString();
};

export { decodeBase64String };
