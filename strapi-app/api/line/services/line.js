"use strict";

const { isDraft } = require("strapi-utils").contentTypes;

//ここに追加など処理を記述
module.exports = {
  async followEvent(events) {
    let userId = events.source.userId;
    let data = { lineUserId: userId };

    const userData = await strapi.query("users").findOne(data);

    if (userData) return;
    //追加処理

    try {
      const validData = await strapi.entityValidator.validateEntityCreation(
        strapi.models.users,
        data,
        { isDraft: isDraft(data, strapi.models.users) }
      );

      const entry = await strapi.query("users").create(validData);
    } catch (error) {
      console.log(error);
    }
  },
};
