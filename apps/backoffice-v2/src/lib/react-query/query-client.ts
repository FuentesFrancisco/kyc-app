import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { IGlobalToastContext } from '../../interfaces';
import { isObject } from '../../utils/is-object/is-object';
import { isErrorWithMessage } from '../../utils/is-error-with-message/is-error-with-message';
import { isZodError } from '../../utils/is-zod-error/is-zod-error';

// TODO: Add i18n plurals
// TODO: Make accessing translations typesafe (json properties)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Otherwise a simple 'Unauthorized (401)' error could cause a retry
      // until the user signs in.
      retry: 3,
    },
  },
  queryCache: new QueryCache({
    onError: error => {
      if (isZodError(error)) {
        toast.error('❌ Validation error');

        return;
      }

      if (
        !isErrorWithMessage(error) ||
        error.message === 'undefined' ||
        error.message === 'null'
      )
        return;

      toast.error(error.message);
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (data, variables, context) => {
      if (!isObject<IGlobalToastContext>(context)) return;

      // Format to 'Action [RESULT]: [ACTION] [RESOURCE]'
      // i.e 'Action succeeded: reject user', fallbacks to 'Action [RESULT]'
      const message =
        context?.resource && context?.action
          ? t('EVENT', {
              resource: t(`RESOURCE.${context.resource}`),
              action: t(`ACTION.${context.action}`),
              result: t('RESULT.SUCCEEDED'),
            })
          : t('RESULT.SUCCEEDED').replace(':', '');

      toast.success(message);
    },
    onError: (error, variables, context) => {
      if (!isObject<IGlobalToastContext>(context) || !isErrorWithMessage(error))
        return;

      const message =
        context?.resource && context?.action
          ? t('EVENT', {
              resource: t(`RESOURCE.${context.resource}`),
              action: t(`ACTION.${context.action}`),
              result: t('RESULT.FAILED'),
            })
          : t('RESULT.FAILED').replace(':', '');

      toast.error(message);
    },
  }),
});