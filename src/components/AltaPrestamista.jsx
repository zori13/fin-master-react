import { Titulo, TextInput, Boton } from "./ui"
import { ABIZoriPro } from "../contracts/ABIs"
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"

export default function AltaPrestamista() {
  const [lenderAddress, setLenderAddress] = useState("");

  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: import.meta.env.VITE_ZoriProPrestamosDefi,
    abi: ABIZoriPro,
    functionName: "altaPrestamista",
    enabled: lenderAddress,
    args: [lenderAddress],
  });

  const { data, write } = useContractWrite(config);

  const isMainPartner = address === data;

  const {
    isLoading: isTransactionLoading,
    isSuccess: isTransactionSuccess,
    isError: isTransactionError,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleLenderAddressInputChange = (event) => {
    setLenderAddress(event.target.value);
  };

  useEffect(() => {
    if (isTransactionSuccess) {
      toast.success("Prestamista dado de alta con éxito");
      setLenderAddress("");
    }
    if (isTransactionError) {
      toast.error(
        "La transacción ha fallado, por favor, revisa los datos de entrada"
      );
    }
  }, [isTransactionSuccess, isTransactionError])

  return (
    <section className="grid gap-3 px-5 bg-white p-4 border shadow rounded-lg text-sm w-fit">
      <Titulo>Alta Prestamista</Titulo>
      <form action="">
        <TextInput
          type="text"
          placeholder="Address Nuevo Empleado Prestamista 0x..."
          label="lenderAddress"
          value={lenderAddress}
          disabled={!isMainPartner || isTransactionLoading}
          onChange={handleLenderAddressInputChange}
        />
      </form>
      <Boton
        disabled={!isMainPartner || !lenderAddress || isTransactionLoading}
        isLoading={isTransactionLoading}
        onClick={() => write?.()}
      >
        {isMainPartner
          ? isTransactionLoading
            ? "Tramitando Alta Nuevo Prestamista"
            : "Alta Prestamista"
          : "Solo puede acceder el Socio Principal"}
      </Boton>
    </section>
  )
}