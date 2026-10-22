import { useState } from 'react'

export function CalculatorIsland() {
  const [count, setCount] = useState(0)

  return (
    <div
      data-testid="calculator-island"
      style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        border: '1px dashed #ced4da',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
      }}
    >
      <p style={{ margin: 0, fontWeight: 600, color: '#212529' }}>Îlot React actif</p>
      <p style={{ margin: '0.5rem 0 1rem', color: '#6c757d', fontSize: '0.9rem' }}>
        Prêt pour l'implémentation du formulaire Mantine.
      </p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '0.9rem',
          cursor: 'pointer',
          borderRadius: '4px',
          border: '1px solid #ced4da',
          backgroundColor: '#ffffff',
          color: '#212529',
        }}
      >
        Test d'interactivité : {count} clic{count > 1 ? 's' : ''}
      </button>
    </div>
  )
}
