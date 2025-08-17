// `caption` yerine `children` alıyoruz
export const ImageWithCaption = ({ src, alt, children, maxWidth = '700px', className }) => {
  return (
    <div className={`flex justify-center ${className || ''}`} style={{ margin: '2em 0' }}>
      <figure style={{ margin: 0, textAlign: 'center' }}>
        <img 
          src={src} 
          alt={alt} 
          style={{ width: '100%', maxWidth: maxWidth, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} 
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