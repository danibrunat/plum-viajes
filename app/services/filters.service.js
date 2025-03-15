export const FilterClientService = {
  handleFilterChange(e, filterId, value) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (e.target.checked) {
      params.append(filterId, value);
    } else {
      const values = params.getAll(filterId).filter((v) => v !== value);
      params.delete(filterId);
      values.forEach((v) => params.append(filterId, v));
    }

    url.search = params.toString();
    window.location.href = url.toString();
  },
};
