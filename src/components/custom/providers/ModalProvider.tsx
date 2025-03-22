import { Box, Modal, Typography } from '@mui/material';
import useUtilityStore from '@store/utilityStore';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function BasicModal() {
    const { modal, setModal } = useUtilityStore();
    const handleClose = () => setModal({ open: false });

    return (
        <>
            <Modal
                open={modal.open || false}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {modal.title || null}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {modal.content || null}
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};
