import React, { useState } from 'react';
import '../css/header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddCardModal from './AddModelCard';

const Header = ({ onSearch }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <>
      <header className="header">
  <div className="header-container">
  <div className="icons">
  <button 
    className="icon-link plus-icon" 
    aria-label="Add new card" 
    onClick={() => setShowModal(true)}
  >
    <FontAwesomeIcon icon={faPlus} />
    <span>ADD CARD</span> {/* Added text */}
  </button>
</div>

    <form className="search-bar" onSubmit={handleSearch}>
      <input 
        type="text" 
        placeholder="Search tasks..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  </div>

  {showModal && <AddCardModal setShowModal={setShowModal} onClose={handleModalClose} />}
</header>
    </>
  );
};

export default Header;
