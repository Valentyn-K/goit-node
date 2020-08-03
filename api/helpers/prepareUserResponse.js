exports.prepareUserResponse = (users) => {
  return users.map((user) => {
    const { _id, email, subscription, token } = user;

    return { _id, email, subscription, token };
  });
};
