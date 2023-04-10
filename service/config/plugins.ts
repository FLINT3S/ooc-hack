module.exports = ({ env }) => ({
  // ...
  "users-permissions": {
    config: {
      ratelimit: {
        interval: 60000,
        max: 100000
      }
    }
  },

  "fuzzy-search": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "api::real-estate.real-estate",
          modelName: "real-estate",
          transliterate: true,
          fuzzysortOptions: {
            characterLimit: 300,
            threshold: -1000,
            limit: 100,
            keys: [
              {
                name: "federalDistrict",
                weight: 100,
              },
              {
                name: "region",
                weight: 100,
              },
              {
                name: "address",
                weight: 300,
              },
              {
                name: "objectState",
                weight: 100,
              },
              {
                name: "area",
                weight: 100,
              }
            ],
          },
        },
        {
          uid: "api::task.task",
          modelName: "task",
          transliterate: true,
          fuzzysortOptions: {
            characterLimit: 300,
            threshold: -1000,
            limit: 100,
            keys: [
              {
                name: "title",
                weight: 300,
              },
              {
                name: "realEstate",
                weight: 100,
              },
              {
                name: "description",
                weight: 300,
              }
            ],
          },
        },
      ],
    },
  }
});
