import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        SynSemClass Search App
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#333',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
  },
  list: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    marginLeft: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
};

export default Header;
