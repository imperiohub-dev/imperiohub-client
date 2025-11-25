import './index.module.scss';

interface StatusBadgeProps {
  isLinked: boolean;
}

export const StatusBadge = ({ isLinked }: StatusBadgeProps) => (
  <span className={`status-badge ${isLinked ? 'success' : 'warning'}`}>
    {isLinked ? (
      <>
        <span>✅</span> Bot Vinculado
      </>
    ) : (
      <>
        <span>⚠️</span> Bot No Vinculado
      </>
    )}
  </span>
);
