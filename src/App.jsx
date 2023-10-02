import { useRef, useState } from "react";
import "./index.css";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 20;

const filters = ["nature", "birds", "cats", "shoes"];

const App = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}?query=${
          searchInput.current.value
        }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
          import.meta.env.VITE_API_KEY
        }`
      );
      console.log("Data recieved: ", data);
      setImages(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchImages();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    fetchImages();
  };

  return (
    <div className="container">
      <h1 className="title">Image Search</h1>
      <div className="search-section">
        <Form onSubmit={handleSubmit}>
          <Form.Control
            type="search"
            placeholder="Type something to search..."
            className="search-input"
            ref={searchInput}
          />
        </Form>
      </div>
      <div className="filters">
        {filters.map((filter) => (
          <div key={filter} onClick={() => handleSelection(filter)}>
            {filter}
          </div>
        ))}
      </div>
      <div className="images">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className="image"
          />
        ))}
      </div>
      <div className="buttons">
        {page > 1 && (
          <Button onClick={() => setPage(prev => prev - 1)}>Previous</Button>
        )}
        {page < totalPages && (
          <Button onClick={() => setPage(prev => prev + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
};

export default App;
