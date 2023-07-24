"use client"
import { FC, startTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { useMutation } from '@tanstack/react-query';
import { SubscribeToSubrepositPayload } from '@/lib/validators/subreposit';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast';

interface SubscribeLeaveToggleProps {
  subrepositId: string
  subrepositName: string
  isSubscribed?: boolean
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
    subrepositId,
    isSubscribed,
    subrepositName,
}) => {
    const {loginToast} = useCustomToast()
    const router = useRouter();


    const { mutate: subscribe, isLoading:isSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubrepositPayload = {
                subrepositId,
            }
            const {data} = await axios.post('/api/subreposit/subscribe', payload)
            return data as string
        },
        onError: (err) => {
            if(err instanceof AxiosError){
                if(err.response?.status === 401){
                    return loginToast()
                }
            }

            return toast({
                title: 'There was a problem!',
                description: 'Something went wrong, Please Try Again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })
            return toast({
                title: 'Subscribed',
                description: `You are now subscribed to r/${subrepositName}`
            })

        }

    })
    const { mutate: unsubscribe, isLoading:isUnsubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubrepositPayload = {
                subrepositId,
            }
            const {data} = await axios.post('/api/subreposit/unsubscribe', payload)
            return data as string
        },
        onError: (err) => {
            if(err instanceof AxiosError){
                if(err.response?.status === 401){
                    return loginToast()
                }
            }

            return toast({
                title: 'There was a problem!',
                description: 'Something went wrong, Please Try Again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })
            return toast({
                title: 'Unsubscribed',
                description: `You are now unsubscribed from r/${subrepositName}`
            })

        }

    })
  return isSubscribed ? (
    <Button 
    isLoading={isUnsubLoading}
    onClick={() => unsubscribe()}
    className="w-full mt-1 mb-4">Leave Community</Button>
  ) : (
    <Button 
    isLoading={isSubLoading}
    onClick={() => subscribe()}
    className="w-full mt-1 mb-4">Join to Post</Button>
  )
}

export default SubscribeLeaveToggle