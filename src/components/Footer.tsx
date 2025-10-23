const Footer = () => {
  return (
    <footer className="mt-20 mb-8">
      {/* Footer Links */}
      <div className="text-center text-sm text-muted-foreground">
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="hover:text-primary transition-smooth">Sobre</a>
          <a href="#" className="hover:text-primary transition-smooth">Blog</a>
          <a href="#" className="hover:text-primary transition-smooth">Suporte</a>
          <a href="#" className="hover:text-primary transition-smooth">Termos</a>
          <a href="#" className="hover:text-primary transition-smooth">Privacidade</a>
        </div>
        <p className="mt-4">© 2024 Detox Mental. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
