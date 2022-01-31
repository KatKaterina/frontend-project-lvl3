import * as yup from 'yup';

export default (data, urls) => {
  yup.setLocale({
    string: {
      url: () => 'errors.invalid',
    },
    mixed: {
      notOneOf: () => 'errors.alreadyExist',
    },
  });

  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(urls),
  });

  return schema.validate(data)
    .then(() => null)
    .catch((e) => e);
};
