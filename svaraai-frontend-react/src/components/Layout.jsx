import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="app">
      <Header />
      <main className="container">{children}</main>
    </div>
  );
}
