import { Titulo, TextInput, Boton } from "./ui"
import { ABIZoriPro } from "../contracts/ABI/ABIZoriPro"
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { parseEther } from "viem/utils"

export default function SolicitarPrestamo() {
  const [saldoGarantia, setSaldoGarantia] = useState("");
  const [monto, setMonto] = useState("");
  const [plazoDevolucion, setPlazoDevolucion] = useState("");

  const { config } = usePrepareContractWrite({
    address: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS,
    abi: ABIZoriPro,
    functionName: "solicitarPrestamo",
    args: [saldoGarantia, parseEther(monto), plazoDevolucion],
  })
  const { data, write } = useContractWrite(config)
  const {
    isLoading: isTransactionLoading,
    isSuccess: isTransactionSuccess,
    isError: isTransactionError,
  } = useWaitForTransaction({
    hash: data?.hash,
  })
  const handleSaldoGarantiaInputChange = (event) => {
    setSaldoGarantia(event.target.value)
  }
  const handleMonto = (event) => {
     setMonto(event.target.value)
  }
  const handlePlazoDevolucion = (event) => {
    setPlazoDevolucion(event.target.value)
  }

  useEffect(() => {
    if (isTransactionSuccess) {
      toast.success("La transacción se ha ejecutado correctamente")
      setSaldoGarantia("");
    }
    if (isTransactionError) {
      toast.error("La transacción ha fallado")
    }
  }, [isTransactionSuccess, isTransactionError])

  useEffect(() => {
    if (isTransactionSuccess) {
      toast.success("La transacción se ha ejecutado correctamente");
      setMonto("");
      setPlazoDevolucion("");
    }
    if (isTransactionError) {
      toast.error("La transacción ha fallado");
    }
  }, [isTransactionSuccess, isTransactionError]);

  return (
    <section className="grid gap-1">
      <Titulo>Solicitar Prestamo</Titulo>

      <form className="grid gap-1 border-2 rounded-lg">
        <div className="grid gap-1 p-1">
          <TextInput
            type="number"
            placeholder="Deposita Garantia, Monto igual al solicitado"
            label="saldoGarantia"
            value={saldoGarantia}
            onChange={handleSaldoGarantiaInputChange}
          />
        </div>
        <div className="grid p-1">
          <Boton
            disabled={!saldoGarantia || isTransactionLoading}
            isLoading={isTransactionLoading}
            onClick={() => write?.()}
          >
            {isTransactionLoading
              ? "Ejecutando transaccion"
              : "Depositar Saldo Garantia"}
          </Boton>
        </div>
      </form>

      <form className="grid gap-1 border-2 rounded-lg">
        <div className="grid gap-2 p-1">
          <TextInput
            type="number"
            placeholder="Cantidad en Ether que solicita"
            label="monto"
            value={monto}
            onChange={handleMonto}
          />
          <TextInput
            type="number"
            placeholder="Indica el Plazo de Devolucion"
            label="plazoDevolucion"
            value={plazoDevolucion}
            onChange={handlePlazoDevolucion}
          />
        </div>
        <div className="grid p-1">
          <Boton
            disabled={!monto || !plazoDevolucion || isTransactionLoading}
            isLoading={isTransactionLoading}
            onClick={() => write?.()}
          >
            {isTransactionLoading
              ? "Estamos Gestionando su Solucitud"
              : "Enviar Solucitud"}
          </Boton>
        </div>
      </form>
    </section>
  )
}