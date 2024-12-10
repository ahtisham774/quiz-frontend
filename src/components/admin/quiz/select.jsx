import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { BASE_URL } from "../../../API";
import toast from "react-hot-toast";

const CustomSelect = ({ defaultValue, handleValue}) => {
  const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [value, setValue] = useState(null);


    useEffect(()=>{
        setValue(defaultValue)
    },[defaultValue])

  // Fetch options from the backend
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/topics/all`);
        if (response.ok) {
          const data = await response.json();
          setOptions(
            data.map((topic) => ({
              value: topic._id,
              label: topic.name,
            }))
        ); // Normalize data format
        
        } else {
          console.error("Failed to fetch options");
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Add new option via backend API
  const handleAddOption = async (name) => {
    console.log("handleAddOption called with name:", name);
    try {
      const response = await fetch(`${BASE_URL}/topics/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        const data = await response.json();
        setOptions((prev) => [
          ...prev,
          { value: data.topic._id, label: data.topic.name },
        ]); // Update the options list
        toast.success(name + " added successfully");
        setInputValue(""); // Clear input value
      } else {
        console.error("Failed to add option");
      }
    } catch (error) {
      console.error("Error adding option:", error);
    }
  };
  console.log("InputValue",inputValue)
  // Delete option via backend API
  const handleDeleteOption = async (optionToDelete) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${optionToDelete.label}"?`
      )
    ) {
      try {
        const response = await fetch(
          `${BASE_URL}/topics/delete/${optionToDelete.value}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setOptions((prev) =>
            prev.filter((option) => option.value !== optionToDelete.value)
          );
        } else {
          console.error("Failed to delete option");
        }
      } catch (error) {
        console.error("Error deleting option:", error);
      }
    }
  };

  // Custom option with delete button
  const CustomOption = (props) => {
    const { data, innerRef, innerProps } = props;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="flex items-center justify-between p-2 bg-white hover:bg-gray-100"
      >
        <span>{data.label}</span>
        <button
            type="button"
          className="p-1 text-sm text-white bg-red-500 rounded"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteOption(data);
          }}
        >
          Delete
        </button>
      </div>
    );
  };

  // Handle input change
  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    
  };

  return (
    <div className="w-full">
      {value != null ?
      <Select
        options={options}
        defaultInputValue={value}
        onChange={(selectedOption) =>
            {   console.log("selectedOption",selectedOption)
                setInputValue(selectedOption ? selectedOption.label : "");
                handleValue(selectedOption ? selectedOption.value : "")}
        }
        onInputChange={handleInputChange}
        className="border-[#999999]"
        placeholder="Search or create..."
        isClearable
        components={{
            Option: CustomOption,
            Menu: (props) => {
              const isCreateOptionVisible =
                inputValue && !options.some((option) => option.label === inputValue);
          
              return (
                <components.Menu {...props}>
                  {isCreateOptionVisible && (
                    <components.Option
                      {...props}
                      className="!text-blue-500 !cursor-pointer hover:!text-red-300"
                      data={{ label: `Create "${inputValue}"`, value: inputValue }}
                      innerRef={null} // React-Select's ref handling
                      innerProps={{
                        onMouseDown: (e) => {
                            e.stopPropagation();
                          console.log("Create clicked with:", inputValue);
                          handleAddOption(inputValue);
                        },
                      }}
                    >
                      Create &ldquo;{inputValue}&rdquo;
                    </components.Option>
                  )}
                  {props.children}
                </components.Menu>
              );
            },
          }}
          
          
          
      />
      :
      <div
        className="flex items-center justify-center w-full h-12 border border-gray-300 rounded-md"
      ></div>
        }
    </div>
  );
};

export default CustomSelect;
