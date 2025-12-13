// import { cn } from '@/lib/utils';
import styles from '../../styles/design.module.css';

export default function Section({ title, subtitle, children, className = '' }) {
  return (
    <section className={[styles.section, className].join(' ')}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h1 className="text-2xl font-semibold">{title}</h1>}
          {subtitle && (
            <p className={['text-gray-600 mt-1', styles.textBlock].join(' ')}>{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
