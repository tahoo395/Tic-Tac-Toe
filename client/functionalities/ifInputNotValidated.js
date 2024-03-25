export let ifInputNotValidated = (name , roomInput) => {
    if (!name || !roomInput) return "Please add name and room number"
    else if (name.length < 3) return "Your name is too small (at least : 3 characters)"
    else if (name.length > 25) return "Your name is too large (highest : 25 characters)"
    else if (roomInput.length < 3) return "Room no. is too small (at least : 3 characters)"
    else if (roomInput.length > 10) return "Room no. is too large (highest : 10 characters)"
    else return false
}