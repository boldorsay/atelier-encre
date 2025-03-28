import { definePlugin } from 'tinacms';

export default definePlugin({
  name: 'one-page-warning',
  ui: {
    components: {
      'collection:create:before': () => {
        return (
          <div style={{
            backgroundColor: '#FFC107',
            padding: '1rem',
            borderRadius: '0.5rem',
            margin: '1rem 0',
            color: '#000'
          }}>
            <h3>⚠️ Attention !</h3>
            <p>Ce site est conçu comme un site one-page. Toutes les sections doivent être ajoutées à la page d'accueil existante.</p>
            <p>Contacte le développeur pour plus d'informations.</p>
          </div>
        );
      }
    }
  }
}); 