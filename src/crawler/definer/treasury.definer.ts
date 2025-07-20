export default {
  treasury: {
    url: "https://api.treasury.id/api/v1/antigrvty/gold/rate",
    engine: "axios",
    method: "POST",
    selector: [
      {
        type: "treasury",
        buy: "data.buying_rate",
        sell: "data.selling_rate",
        info: "data.updated_at",
        weight: 1,
        unit: "gram",
      },
    ],
  },
}