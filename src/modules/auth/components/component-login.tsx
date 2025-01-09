'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock } from 'lucide-react'
import { Button } from '../../../app/components/ui/button'
import { Input } from '../../../app/components/ui/input'
import { Label } from '../../../app/components/ui/label'
import { Card, CardContent } from '../../../app/components/ui/card'
import { useAdminLogin } from '../hook/useLogin';


export default function Component() {
  const { loginFn, isPending } = useAdminLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginFn({ email, password });
      setError('');
      router.push('/pages/dashboard');
    } catch (error) {
      setError('Contraseña o usuario incorrecto');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/fondo-login.png')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="container mx-auto max-w-4xl flex justify-center">
        <Card className="flex w-full overflow-hidden">
          <CardContent className="flex-1 p-6 bg-white/95">
            <div className="mb-6 flex flex-col items-center">
              <div className="mb-4 h-24 w-24 relative">
                <Image
                  src="/misa.png"
                  alt="Misa Logo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h1 className="text-xl font-semibold">INICIAR SESIÓN</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Usuario</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Correo electrónico"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Contraseña"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isPending}>
                Iniciar Sesión
              </Button>
              <button
                type="button"
                className="mx-auto block text-sm text-gray-600 hover:underline"
                onClick={() => {
                  // Acción para recuperar contraseña
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          </CardContent>

          <CardContent className="flex-1 p-6 bg-black/70 text-white opacity-80">
            <div className="h-full flex flex-col justify-center space-y-6">
              <h2 className="text-center text-3xl font-semibold">CONTÁCTAR AL ADMINISTRADOR</h2>
              <h2 className="text-center text-3xl font-extrabold">________________________________</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-white text-xl">Teléfono:</Label>
                  <span>********</span>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-white text-xl">Email:</Label>
                  <span>********</span>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-white text-xl">Dirección:</Label>
                  <span>********</span>
                </div>
                <h2 className="text-center text-3xl font-extrabold">________________________________</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
