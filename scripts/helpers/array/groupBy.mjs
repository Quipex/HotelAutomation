function groupBy(list, keyGetter) {
  return list.reduce((acc, item) => {
    const key = keyGetter(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}

export default groupBy;
