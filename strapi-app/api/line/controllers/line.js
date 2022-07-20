"use strict";

const line = require("../services/line");

module.exports = {
  async webhook(ctx) {
    //ctxのobjectの配列のobjectのuserId
    let obj = ctx.request.body;
    let events = obj["events"][0];
    //let userId = events.source.userId;
    let type = events.type;

    if (type == "follow") {
      //フォローされた時
      line.followEvent(events);
    }
    ctx.send();
  },
};
