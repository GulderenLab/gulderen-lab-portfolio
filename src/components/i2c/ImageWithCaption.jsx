// `caption` yerine `children` alıyoruz
export const ImageWithCaption = ({ src, alt, children, maxWidth = '700px' }) => {
  return (
    <div style={{ textAlign: 'center', margin: '2em 0' }}>
      <figure style={{ margin: 0 }}>
        <img 
          src={src} 
          alt={alt} 
          style={{ width: '100%', maxWidth: maxWidth }} 
        />
        {/* children varsa figcaption'ı render ediyoruz */}
        {children && (
          <figcaption style={{ marginTop: '0.5em', fontSize: '0.9em', color: 'white' }}>
            {children} {/* ARTIK DOĞRU ÇALIŞACAK */}
          </figcaption>
        )}
      </figure>
    </div>
  );
};