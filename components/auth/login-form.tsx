import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent } from "react"

interface LoginFormProps extends React.ComponentProps<"div"> {
  noKk: string
  noRumah: string
  blok: string
  isLoading: boolean
  error: string | null
  onNoKkChange: (noKk: string) => void
  onNoRumahChange: (noRumah: string) => void
  onBlokChange: (blok: string) => void
  onSubmit: (e: FormEvent) => void
}

export function LoginForm({
  className,
  noKk,
  noRumah,
  blok,
  isLoading,
  error,
  onNoKkChange,
  onNoRumahChange,
  onBlokChange,
  onSubmit,
  ...props
}: LoginFormProps) {

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">PEMILIHAN RT</CardTitle>
          <CardDescription>
            Silakan masuk untuk memberikan suara Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid gap-6">
              {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}
              <div className="grid gap-3">
                <Label htmlFor="noKk">Nomor KK (Kartu Keluarga)</Label>
                <Input
                  id="noKk"
                  type="text"
                  placeholder="Masukkan Nomor KK"
                  value={noKk}
                  onChange={(e) => onNoKkChange(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="noRumah">Nomor Rumah</Label>
                <Input
                  id="noRumah"
                  type="text"
                  placeholder="Masukkan Nomor Rumah"
                  value={noRumah}
                  onChange={(e) => onNoRumahChange(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="blok">Blok</Label>
                <Input
                  id="blok"
                  type="text"
                  placeholder="Masukkan Blok"
                  value={blok}
                  onChange={(e) => onBlokChange(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}