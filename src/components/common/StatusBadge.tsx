interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending';
  label?: string;
}

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const badges = {
    active: 'status-badge status-active',
    inactive: 'status-badge status-inactive',
    pending: 'status-badge status-pending',
  };

  const labels = {
    active: label || 'Active',
    inactive: label || 'Inactive',
    pending: label || 'Pending',
  };

  return (
    <span className={badges[status]}>
      {labels[status]}
    </span>
  );
};
