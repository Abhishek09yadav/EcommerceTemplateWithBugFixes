import requests from "./httpServices";

const AttributeServices = {
  getAllAttributes: async () => {
    return requests.get("/attributes");
  },

  getShowingAttributes: async () => {
    return requests.get(`/attributes/show`);
  },

  getAttributeById: async (id) => {
    return requests.get(`/attributes/${id}`);
  },
};

export default AttributeServices;
