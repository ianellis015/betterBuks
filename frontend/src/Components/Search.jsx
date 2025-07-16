import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import SearchIcon from "../assets/search-icon.svg";
import ArrowIcon from "../assets/arrow-forward-icon.svg";
import styles from './Search.module.css';

export default function Search() {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropDownRef = useRef(null);

    const handleSearch = async () => {
        if (!query) return;
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/search-ticker?query=${query}`);
            console.log(res.data);
            setResults(res.data.results);
            setIsOpen(true);
        } catch (error) {
            console.error("Error fetching ticker:", error);
        }
    };

    // Debounce live search effect
    useEffect(() => {
        if (!query) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const delayDebounce = setTimeout(() => {
            handleSearch();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const handleKeyDown = (e) => {
        if (!isOpen) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    setQuery(results[selectedIndex].symbol);
                    setIsOpen(false);
                    setSelectedIndex(-1);
                }
                break;
            case "Escape":
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    const handleClickSuggestion = (symbol) => {
        setQuery(symbol);
        setIsOpen(false);
        setSelectedIndex(-1);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSelectedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Navigate to the Stock Analysis Page

    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!query) return;
        navigate(`/analyze/${query}`)
    };


    return (
        <div className={styles.searchbox}>
            <div className={styles.innerContent}>
                <h2>Start Your Analysis</h2>
                <p>Enter a stock symbol to begin your evaluation.</p>
                <div className={styles.userInputsContainer}>
                    <div className={styles.inputWrapper}>
                        <img src={SearchIcon} className={styles.icon} alt="Search Icon" />
                        <input
                            className={styles.searchInput}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter a stock symbol"
                            autoComplete="off"
                        />
                        {isOpen && (
                            <div ref={dropDownRef} className={styles.dropdown}>
                                {results.map((item, index) => (
                                    <div
                                        key={item.symbol}
                                        className={`${styles.dropdownItem} ${
                                            index === selectedIndex ? styles.selected : ""
                                        }`}
                                        onClick={() => handleClickSuggestion(item.symbol)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                    >
                                        <span className={styles.tickerBadge}>{item.symbol}</span><span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        className={styles.analyzeButton}
                        onClick={handleNavigate}
                    >
                        Analyze
                        <img src={ArrowIcon} className={styles.arrow} />
                    </button>
                </div>
                <div>
                    {results.length > 0 && (
                        <div key={results[0].symbol}>
                            {results[0].symbol} - {results[0].name}
                        </div>
                    )}
                </div>
                <div className={styles.quickPicks}>
                    <div className={styles.popular}>Popular:</div>
                    <div className={styles.popStock} onClick={() => setQuery("AAPL")}>AAPL</div>
                    <div className={styles.popStock} onClick={() => setQuery("NVDA")}>NVDA</div>
                    <div className={styles.popStock} onClick={() => setQuery("GOOGL")}>GOOGL</div>
                    <div className={styles.popStock} onClick={() => setQuery("AMZN")}>AMZN</div>
                    <div className={styles.popStock} onClick={() => setQuery("TSLA")}>TSLA</div>
                </div>
            </div>
        </div>
    )
}