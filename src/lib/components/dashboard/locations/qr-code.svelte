<script lang="ts">
    import { qr } from '@svelte-put/qr/svg';
    import * as Dialog from "$lib/components/ui/dialog";
    import Button from "$lib/components/ui/button/button.svelte";
    import { QrCode } from 'lucide-svelte'
    import { Switch } from "$lib/components/ui/switch";

    export let url: string
    let downloadBg = true
    let svgRef: Node

    const downloadQR = () => {
        const svg = svgRef;
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();

        const additionalImg = new Image();
        additionalImg.src = '/favicon.png';

        additionalImg.onload = function () {
            img.onload = function () {
                const canvas = document.createElement('canvas');

                canvas.width = 1200;
                canvas.height = 1200;

                const ctx = canvas.getContext('2d');

                if (downloadBg && ctx) {
                    ctx.fillStyle = 'white';
                    ctx?.fillRect(0, 0, 1200, 1200);
                }

                ctx?.drawImage(img, 0, 0, 1200, 1200);

                const centerX = (1200 - 280) / 2;
                const centerY = (1200 - 280) / 2;

                ctx?.drawImage(additionalImg, centerX, centerY, 280, 280);

                const pngUrl = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');

                downloadLink.href = pngUrl;
                downloadLink.download = 'image.png';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                URL.revokeObjectURL(pngUrl);
            };
            img.src = url;
        };
    }

    const printQR = () => {
        var prtContent = document.getElementById("qr-code");
        var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

        WinPrint?.document.write(prtContent?.innerHTML || '');
        WinPrint?.document.close();
        WinPrint?.focus();
        WinPrint?.print();

        if (WinPrint) WinPrint.onafterprint = () => {
            WinPrint?.close();
        };
    }
</script>

<Dialog.Root>
    <Dialog.Trigger asChild let:builder>
        <Button builders={[builder]} class="mx-auto flex h-fit px-[6px] py-3" variant="ghost">
            <QrCode class="w-[18px] h-[18px]" />
        </Button>
    </Dialog.Trigger>

    <Dialog.Content class="max-w-[400px]">
        <Dialog.Header>
            <Dialog.Title>
                QR Code
            </Dialog.Title>

            <Dialog.Description>
                Share your location's QR code with your clients!
            </Dialog.Description>
        </Dialog.Header>

        <div class="flex flex-col">
            <div id='qr-code'>
                <svg bind:this={svgRef}
                use:qr={{
                    data: url,
                    logo: '/favicon.png',
                    shape: 'circle',
                }}
                />
            </div>

            <div class="flex flex-row items-center gap-x-2 mt-4">
                <Switch bind:checked={downloadBg} />

                <span class="text-sm text-gray-600 dark:text-slate-300">
                    Download with background
                </span>
            </div>

            <div class="flex flex-row gap-x-4 mt-6">
                <Button class="w-full"on:click={() => downloadQR()}>
                    Download
                </Button>

                <Button variant="outline" class="w-full" on:click={() => printQR()}>
                    Print
                </Button>
            </div>
        </div>
    </Dialog.Content>
</Dialog.Root>