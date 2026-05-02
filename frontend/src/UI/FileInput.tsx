import {useEffect, useRef, useState} from "react";
import {Button, Grid, TextField} from "@mui/material";

interface Props {
    name: string;
    label: string;
    value: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<Props> = ({name, label, onChange, value}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [filename, setFilename] = useState<string>('');

    useEffect(() => {
        if (value === null && inputRef.current) {
            inputRef.current.value = '';
        }
    }, [value]);


    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if ( e.target.files && e.target.files[0]) {
            setFilename(e.target.files[0].name);
        }else {
            setFilename('');
        }

        onChange(e);
    }

    const activateInput = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }
    return (
        <>
            <input
                style={{display: 'none'}}
                type="file"
                name={name}
                ref={inputRef}
                onChange={onFileChange}
            />
            <Grid container sx={{direction:"row", gap: 2, alignItems:"center"}}>
                <Grid>
                    <TextField
                        label={label}
                        value={filename}
                        disabled
                    />
                </Grid>
                <Grid>
                    <Button
                        type="button"
                        onClick={activateInput}
                        variant="contained"
                    >
                        Browse
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default FileInput;