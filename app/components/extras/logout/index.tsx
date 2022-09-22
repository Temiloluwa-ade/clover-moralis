
export const logout = () => {
    localStorage.removeItem('cloverlog');

    window.location.href = '/';
}