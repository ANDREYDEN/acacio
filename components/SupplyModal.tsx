import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, ErrorMessage, Loader, Modal } from '@components'
import { useAnalyzeSupplies } from '@lib/services/poster'
import NumberInputCell from '@components/NumberInputCell'

interface ISupplyModal {
    toggleModal: (visible: boolean) => void
}

const SupplyModal: React.FC<ISupplyModal> = ({ toggleModal }: ISupplyModal) => {
    const { t } = useTranslation('stock')

    const { analyze, loading, error } = useAnalyzeSupplies()
    const [monthsBack, setMonthsBack] = useState(1)

    const header = <h4>{t('supply_modal.header')}</h4>

    return (
        <Modal toggler={() => toggleModal(false)} header={header}>
            <div className='flex flex-col items-center w-80'>
                {error
                    ? <ErrorMessage message={error} />
                    : loading
                        ? <Loader />
                        : <div className='flex flex-col items-center'>
                            <label className='mb-6'>
                                <NumberInputCell
                                    value={monthsBack}
                                    onBlur={setMonthsBack}
                                    additionalStyle='w-8 mr-4'
                                />
                                {t('supply_modal.timeframe')}
                            </label>
                            <Button label={t('supply_modal.action')} onClick={() => analyze(monthsBack)} />
                        </div>
                }
            </div>
        </Modal>
    )
}

export default SupplyModal
