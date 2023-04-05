import { useState, useEffect, useContext, useRef } from "react";
import { Search } from "@material-ui/icons";
import {
  makeStyles,
  TextField,
  InputAdornment,
  TextFieldProps,
} from "@material-ui/core";
import useDebounce from "../hooks/useDebounce";
import { SearchContext } from "./SearchContext";

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    color: theme.palette.primary.main,
    marginRight: "0.6rem",
    fontSize: "1.6rem",
  },
  escButton: {
    cursor: "pointer",
    alignSelf: "center",
    margin: "0 10px",
    padding: "0.1rem 0.8rem 0.2rem",
    borderRadius: "5px",
    color: "#fff",
    border: "1px solid " + theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main,
    fontSize: "1.2rem",
  },
  searchInput: {
    width: "100%",
    appearance: "none",
    background: "transparent",
    border: "0 !important",
    color: "grey",
    font: "inherit",
    height: "100%",
    outline: "none",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.2rem",
    alignItems: "center",
    paddingBottom: "0.4rem",
  },
  inputPadding: {
    padding: "0 1rem 0.5rem 1rem",
  },
}));

function SearchInput({
  params,
  debounceValue,
  onClose,
  changeInputValue,
  isHomePage,
  focus,
}: {
  params: TextFieldProps;
  debounceValue: (str: string) => void;
  changeInputValue: (str: string) => void;
  onClose: () => void;
  isHomePage: boolean;
  focus: boolean;
}) {
  const classes = useStyles();
  const [searchInputValue, setSearchInputValue] = useState("");
  const debouncedInputValue = useDebounce(searchInputValue, 300);
  const { searchPlaceholder, inputValue } = useContext(SearchContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    debounceValue(debouncedInputValue);
  }, [debouncedInputValue]);

  useEffect(() => {
    if (inputRef.current) {
      (!isHomePage || focus) && inputRef.current.focus();
      // (isHomePage && !focus) && inputRef.current.blur();
    }
  }, [focus, isHomePage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = inputValue;
    }
  }, [inputValue]);

  return (
    <div className={classes.searchContainer}>
      <TextField
        inputRef={inputRef}
        className={classes.searchInput}
        {...params}
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <Search className={classes.searchIcon} />
            </InputAdornment>
          ),
          endAdornment: !isHomePage && (
            <InputAdornment position="end">
              <button className={classes.escButton} onClick={onClose}>
                esc
              </button>
            </InputAdornment>
          ),
          className: classes.inputPadding,
        }}
        onChange={(e) => {
          setSearchInputValue(e.target.value.trim() || "");
          changeInputValue(e.target.value.trim() || "");
        }}
        value={searchInputValue}
        placeholder={searchPlaceholder}
      />
    </div>
  );
}

export default SearchInput;