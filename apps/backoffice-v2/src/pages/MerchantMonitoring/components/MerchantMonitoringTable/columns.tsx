import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import dayjs from 'dayjs';
import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { BusinessReportStatus, TBusinessReport } from '@/domains/business-reports/fetchers';
import { titleCase } from 'string-ts';

import { severityToClassName, severityToTextClassName } from '@/common/constants';
import { ctw } from '@/common/utils/ctw/ctw';
import { getSeverityFromRiskScore } from '@/common/utils/get-severity-from-risk-score';
import { Badge } from '@ballerine/ui';
import { Severity } from '@/common/types';

const columnHelper = createColumnHelper<TBusinessReport>();

export const columns = [
  columnHelper.accessor('createdAt', {
    cell: info => {
      const createdAt = info.getValue();

      if (!createdAt) {
        return <TextWithNAFallback>{createdAt}</TextWithNAFallback>;
      }

      const date = dayjs(createdAt).format('MMM DD, YYYY');
      const time = dayjs(createdAt).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Created At',
  }),
  columnHelper.accessor('updatedAt', {
    cell: info => {
      const updatedAt = info.getValue();

      if (!updatedAt) {
        return <TextWithNAFallback>{updatedAt}</TextWithNAFallback>;
      }

      const date = dayjs(updatedAt).format('MMM DD, YYYY');
      const time = dayjs(updatedAt).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Updated At',
  }),
  columnHelper.accessor('business.website', {
    cell: info => {
      const website = info.getValue();

      return <TextWithNAFallback>{website}</TextWithNAFallback>;
    },
    header: 'Website',
  }),
  columnHelper.accessor('business.companyName', {
    cell: info => {
      const companyName = info.getValue();

      return <TextWithNAFallback>{companyName}</TextWithNAFallback>;
    },
    header: 'Company Name',
  }),
  columnHelper.accessor('business.country', {
    cell: info => {
      const companyName = info.getValue();

      return <TextWithNAFallback>{companyName}</TextWithNAFallback>;
    },
    header: 'Country',
  }),
  columnHelper.accessor('riskScore', {
    cell: info => {
      const riskScore = info.getValue();
      const severity = getSeverityFromRiskScore(riskScore);

      return (
        <div className="flex items-center gap-2">
          <TextWithNAFallback
            className={ctw(
              {
                [severityToTextClassName[
                  (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
                ]]: riskScore || riskScore === 0,
                'font-bold': riskScore || riskScore === 0,
                'text-destructive': severity === Severity.CRITICAL || severity === Severity.HIGH,
              },
              'py-0.5',
            )}
            checkFalsy={false}
          >
            {riskScore}
          </TextWithNAFallback>
          {(riskScore || riskScore === 0) && (
            <Badge
              className={ctw(
                severityToClassName[
                  (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
                ],
                'w-20 py-0.5 font-bold',
              )}
            >
              {titleCase(severity ?? '')}
            </Badge>
          )}
        </div>
      );
    },
    header: 'Risk Score',
  }),
  columnHelper.accessor('status', {
    cell: info => {
      const status = info.getValue();
      const statusToDisplayStatus = {
        [BusinessReportStatus.COMPLETED]: 'Manual Review',
      } as const;

      return (
        <TextWithNAFallback
          className={ctw('font-semibold', {
            'text-slate-400': status === BusinessReportStatus.COMPLETED,
          })}
        >
          {titleCase(statusToDisplayStatus[status as keyof typeof statusToDisplayStatus] ?? status)}
        </TextWithNAFallback>
      );
    },
    header: 'Status',
  }),
];
