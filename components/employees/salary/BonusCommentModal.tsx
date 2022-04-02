import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, Modal } from '@components'
import { IBonusInput } from '@interfaces'

interface IBonusCommentModal {
    onCloseModal: () => void
    bonus: IBonusInput
}

const BonusCommentModal: React.FC<IBonusCommentModal> = ({ onCloseModal, bonus }: IBonusCommentModal) => {
    const { t } = useTranslation('salary')
    const [comment, setComment] = useState(bonus.value?.reason ?? '')

    const handleSubmit = () => {
        bonus.onReasonChange(comment)
        onCloseModal()
    }

    const ModalHeader: ReactElement = <div className='flex flex-col'>
        <h4>{t('bonus_comment.header')}</h4>
        <p className='text-dark-grey mt-2'>{t('bonus_comment.message')}</p>
    </div>

    const ModalFooter: ReactElement =
        <Button
            label={t('save', { ns: 'common' })}
            buttonClass='w-full'
            onClick={handleSubmit}
        />

    return (
        <Modal
            header={ModalHeader}
            toggler={onCloseModal}
            footer={ModalFooter}
        >
            <form className='w-96 flex flex-col'>
                <label htmlFor='reason' className='my-2'>{t('bonus_comment.comment')}</label>
                <textarea
                    name='reason'
                    id='reason'
                    value={comment}
                    className='h-28 border border-grey outline-none rounded-lg py-2 px-4 text-primary-text
                        placeholder-dark-grey focus:border-dark-grey'
                    onChange={(e) => setComment(e.target.value)}
                />
            </form>
        </Modal>
    )
}

export default BonusCommentModal