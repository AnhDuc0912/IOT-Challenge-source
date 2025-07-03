import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // <== Quan trọng, để đúng nếu bạn dùng domain ở root
  plugins: [react()],
});
