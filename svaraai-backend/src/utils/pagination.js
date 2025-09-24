const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
  return { page, limit };
};
module.exports = { parsePagination };
