import Box from "@mui/material/Box";
import { FormProvider, FTextField } from "./form";
import Modal from "@mui/material/Modal";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { alpha,  Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { addPokemon } from "../features/pokemons/pokemonSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const defaultValues = {
  name: "",
  id: "",
  url: "",
  type1: "",
  type2: "",
};

export default function PokemonModal({ open, setOpen }) {
  const { allId, allName } = useSelector((state) => state.pokemons);
  const [imageFile, setImageFile] = useState(null); // Dùng để lưu file image
  const [imagePreview, setImagePreview] = useState(null); // Dùng để lưu URL xem trước
  const resetForm = () => {
    methods.reset(defaultValues);
    setImageFile(null);
    setImagePreview(null);
  };
  // Khi file được chọn
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const validateForm = (data) => {
    if (!data.name) {
      return { isValid: false, message: "Name is required" };
    }
    if (allName.includes(data.name.toLowerCase())) {
      return {
        isValid: false,
        message: `name = ${data.name} of Pokemon already exists`,
      };
    }
    if (!data.type1 && !data.type2) {
      return { isValid: false, message: "At least one type is required" };
    }
    if (!data.id ) {
      return { isValid: false, message: `id  of Pokemon is required` };
    }
    if (!(!isNaN(parseInt(data.id)) && parseInt(data.id)> 0 )) {
        console.log(data.id);
      return { isValid: false, message: `id  must is a interger number > 0` };
    }
    if (allId.includes(parseInt(data.id))) {
      return {
        isValid: false,
        message: `id = ${data.id} of Pokemon already exists`,
      };
    }
    
    if (!imageFile) {
      return { isValid: false, message: `Image  of Pokemon is required` };
    }
    const extension = imageFile.name.split(".").pop();
    console.log("exten", extension);
    if (
      !(extension.toLowerCase() !== ".jpg" &&
      extension.toLowerCase() !== ".png")
    ) {
      return {
        isValid: false,
        message: `Extension File  must is .jpg or .png`,
      };
    }
    return { isValid: true };
  };
  const navigate = useNavigate();
  const methods = useForm(defaultValues);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const validation = validateForm(data);
    if (!validation.isValid) {
     
      alert(validation.message);
     
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    if (imageFile) {
      formData.append("image", imageFile);
      const extension = imageFile.name.split(".").pop();
      formData.append("extFile", extension);
      console.log("imagefileext", extension);
    }
    
    dispatch(addPokemon(formData,parseInt(data.id)));
    // resetForm();
   
    
        navigate(`/pokemons/${data.id}`);
        resetForm();
        setOpen(false);
    
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <FTextField
                name="name"
                fullWidth
                rows={4}
                placeholder="Name"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                name="id"
                fullWidth
                rows={4}
                placeholder="Id"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
             
              <FTextField
                type="file"
                name="image"
                onChange={handleFileChange}
              />
              {imagePreview && <img src={imagePreview} alt="Preview" />}
              <FTextField
                name="type1"
                fullWidth
                rows={4}
                placeholder="Type 1"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                name="type2"
                fullWidth
                rows={4}
                placeholder="Type 2"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  loading={
                    isSubmitting
                    // || isLoading
                  }
                >
                  Create Pokemon
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
}
