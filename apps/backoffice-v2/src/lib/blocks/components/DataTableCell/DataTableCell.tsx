import { FunctionComponent } from 'react';
import { ExtractCellProps } from '@ballerine/blocks';
import { DataTable } from '@/common/components/organisms/DataTable/DataTable';

export const DataTableCell: FunctionComponent<ExtractCellProps<'dataTable'>> = ({ value }) => (
  <DataTable {...value} />
);
