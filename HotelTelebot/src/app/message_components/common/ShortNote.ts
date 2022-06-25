const ShortNote = (notes: string) => {
  const singleLineNote = notes.replace('\n', ' ');
  return singleLineNote.length > 30 ? `${singleLineNote.substring(0, 30)}...` : singleLineNote;
};

export default ShortNote;
