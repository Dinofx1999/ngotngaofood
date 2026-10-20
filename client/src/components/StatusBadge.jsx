import { STATUS_LABELS } from '../utils';

export default function StatusBadge({ status }) {
  return <span className={`status status-${status}`}>{STATUS_LABELS[status] || status}</span>;
}
