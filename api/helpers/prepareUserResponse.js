exports.prepareUserResponse = (users) => {
  return users.map((user) => {
    const { _id, email, subscription, token, avatarURL } = user;

    return { _id, email, subscription, token, avatarURL };
  });
};
