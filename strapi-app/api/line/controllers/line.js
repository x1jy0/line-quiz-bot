'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async webhook(ctx) {
    //if(Follow) true:servicesのfollowEventを呼び出し
    console.log(ctx.request.body);
    ctx.send();
  }
};
