import * as yup from 'yup';

export default (data, urls, i18nInstance) => {
  yup.setLocale({
    string: {
      url: () => i18nInstance.t('errors.invalid'),
    },
    mixed: {
      notOneOf: () => i18nInstance.t('errors.alreadyExist'),
    },
  });

  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(urls),
  });

  return schema.validate(data)
    .then(() => null)
    .catch((e) => e);
};
